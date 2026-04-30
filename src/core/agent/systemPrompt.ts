/**
 * Phase D — Agent system prompt builder.
 *
 * Constructs the system prompt injected into each Claude query.
 * The prompt instructs Claude to output structured page-builder actions
 * inside <pb:actions> XML tags, alongside human-readable text.
 *
 * No SDK imports — safe to use in both browser (for documentation) and
 * the server (for actual invocation).
 *
 * Constraint #283/#286: this file has no Anthropic SDK dependency.
 */

import type { AgentModuleContext, PageContext } from './types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * XML-escape a string for safe interpolation into XML attribute values.
 * Prevents CWE-1336 prompt injection via user-controlled class names / IDs.
 * Order matters: `&` must be replaced first to avoid double-escaping.
 */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// ---------------------------------------------------------------------------
// Action schema documentation — injected into the system prompt
// ---------------------------------------------------------------------------

type AvailableModuleForPrompt = AgentModuleContext | string

function formatAvailableModules(modules: AvailableModuleForPrompt[]): string {
  const normalizedModules = modules
    .map(normalizeAvailableModule)
    .filter((mod) => mod.id)
    .sort((a, b) => a.id.localeCompare(b.id))

  if (normalizedModules.length === 0) return '<module-registry />'

  return [
    '<module-registry>',
    ...normalizedModules.map(formatAvailableModule),
    '</module-registry>',
  ].join('\n')
}

function normalizeAvailableModule(module: AvailableModuleForPrompt): AgentModuleContext {
  if (typeof module === 'string') {
    return {
      id: module,
      name: module,
      category: '',
      canHaveChildren: false,
      defaults: {},
      props: [],
      styles: [],
    }
  }
  return module
}

function formatAvailableModule(module: AgentModuleContext): string {
  const attrs = [
    `id="${escapeXml(module.id)}"`,
    `name="${escapeXml(module.name)}"`,
    `category="${escapeXml(module.category)}"`,
    `canHaveChildren="${module.canHaveChildren ? 'true' : 'false'}"`,
  ].join(' ')

  const lines = [`  <module ${attrs}>`]
  if (module.description) {
    lines.push(`    <description>${escapeXml(module.description)}</description>`)
  }
  lines.push(`    <defaults>${escapeXml(stableJson(module.defaults))}</defaults>`)

  const props = module.props ?? []
  const styles = module.styles ?? []

  if (props.length > 0) {
    lines.push('    <props>')
    for (const prop of props) {
      const propAttrs = [
        `key="${escapeXml(prop.key)}"`,
        `type="${escapeXml(prop.type)}"`,
        `label="${escapeXml(prop.label)}"`,
      ]
      if (prop.description) propAttrs.push(`description="${escapeXml(prop.description)}"`)
      if (prop.defaultValue !== undefined) {
        propAttrs.push(`default="${escapeXml(stableJson(prop.defaultValue))}"`)
      }
      if (prop.options?.length) {
        propAttrs.push(`options="${escapeXml(stableJson(prop.options))}"`)
      }
      lines.push(`      <prop ${propAttrs.join(' ')} />`)
    }
    lines.push('    </props>')
  } else {
    lines.push('    <props />')
  }

  if (styles.length > 0) {
    lines.push('    <style-bindings>')
    for (const style of styles) {
      const styleAttrs = [
        `key="${escapeXml(style.key)}"`,
        `type="${escapeXml(style.type)}"`,
        `label="${escapeXml(style.label)}"`,
        `cssProperties="${escapeXml(stableJson(style.cssProperties))}"`,
      ]
      if (style.description) styleAttrs.push(`description="${escapeXml(style.description)}"`)
      if (style.defaultValue !== undefined) {
        styleAttrs.push(`default="${escapeXml(stableJson(style.defaultValue))}"`)
      }
      if (style.options?.length) {
        styleAttrs.push(`options="${escapeXml(stableJson(style.options))}"`)
      }
      lines.push(`      <style ${styleAttrs.join(' ')} />`)
    }
    lines.push('    </style-bindings>')
  } else {
    lines.push('    <style-bindings />')
  }

  lines.push('  </module>')
  return lines.join('\n')
}

function stableJson(value: unknown): string {
  return JSON.stringify(value)
}

function buildActionDocs(ctx: PageContext): string {
  return `
## Available Actions

Output actions in a \`<pb:actions>\` block containing a JSON array.
Each action object must have a "type" field plus the parameters below.

### insertTree
Efficiently insert a styled nested node tree in one action. Prefer this for page, section, landing page, card grid, hero, and multi-element builds.
Use "classes" to create/update reusable CSS classes first, then reference those class names from tree nodes with "classIds".
The root tree node and child nodes support "ref", "moduleId", "props", "classIds", and "children".
{
  "type": "insertTree",
  "parentId": "<existing-node-id>",
  "classes": [
    { "name": "hero-section", "styles": { "display": "flex", "flexDirection": "column", "gap": "24px", "paddingTop": "96px", "paddingRight": "64px", "paddingBottom": "96px", "paddingLeft": "64px", "backgroundColor": "#111827", "color": "#ffffff" } },
    { "name": "hero-title", "styles": { "fontSize": "56px", "lineHeight": "1", "fontWeight": "700", "color": "#ffffff" } }
  ],
  "tree": {
    "ref": "hero",
    "moduleId": "base.container",
    "props": { "tag": "section" },
    "classIds": ["hero-section"],
    "children": [
      { "ref": "hero-title", "moduleId": "base.text", "props": { "text": "Welcome", "tag": "h1" }, "classIds": ["hero-title"] }
    ]
  }
}

### insertNode
Insert one new element into the page. Use insertTree instead for multi-node page or section builds.
Use "parentId" for an existing node ID. Use "ref" plus "parentRef" to nest nodes created earlier in the same batch.
Use "classIds" with existing class IDs or class names created earlier in the same batch to style new nodes immediately.
{ "type": "insertNode", "ref": "hero", "moduleId": "base.container", "parentId": "<existing-node-id>", "props": { "tag": "section" } }
{ "type": "insertNode", "ref": "hero-title", "moduleId": "base.text", "parentRef": "hero", "props": { "text": "Hello", "tag": "h1" }, "classIds": ["hero-title"] }

Available moduleIds:
Each module's <props> are content/behavior settings for insertNode.props.
Each module's <style-bindings> lists class-backed CSS properties that are good styling targets for createClass.styles.
${formatAvailableModules(ctx.availableModules)}

### deleteNode
Remove a node and all its children.
{ "type": "deleteNode", "nodeId": "<node-id>" }
{ "type": "deleteNode", "nodeRef": "temporary-ref-from-insertNode" }

### updateNodeProps
Change property values on an existing node.
{ "type": "updateNodeProps", "nodeId": "<node-id>", "patch": { "text": "New text", "tag": "h2" } }
{ "type": "updateNodeProps", "nodeRef": "hero-title", "patch": { "text": "New text" } }

### moveNode
Move a node to a different parent or position.
{ "type": "moveNode", "nodeId": "<node-id>", "newParentId": "<parent-id>", "newIndex": 0 }
{ "type": "moveNode", "nodeRef": "hero-title", "newParentRef": "hero", "newIndex": 0 }

### renameNode
Set the display label for a node (shown in the DOM tree panel).
{ "type": "renameNode", "nodeId": "<node-id>", "label": "Hero Section" }
{ "type": "renameNode", "nodeRef": "hero", "label": "Hero Section" }

### createClass
Create a reusable CSS class with initial styles. Use camelCase CSS property names.
{ "type": "createClass", "name": "btn-primary", "styles": { "backgroundColor": "#6366f1", "color": "#fff", "borderRadius": "6px", "padding": "8px 16px" } }

IMPORTANT: After creating a class you do NOT know its generated ID.
Use the class NAME (not ID) in insertNode.classIds / assignClass / updateClassStyles for a class you just created —
the system resolves names to IDs automatically. This lets you create and assign in one batch.
For styled layouts, create classes first, then attach them on insertNode via classIds or with assignClass nodeRef.

### updateClassStyles
Update the styles of an existing CSS class.
For existing classes use the ID from the CSS Classes section below.
For a class created in the same batch use its name.
{ "type": "updateClassStyles", "classId": "<class-id-or-name>", "patch": { "fontSize": "16px" } }

### assignClass
Assign a CSS class to a node.
For existing classes use the ID from the CSS Classes section below.
For a class created in the same batch use its name.
{ "type": "assignClass", "nodeId": "<node-id>", "classId": "<class-id-or-name>" }
{ "type": "assignClass", "nodeRef": "hero-title", "classId": "hero-title" }

### removeClass
Remove a CSS class from a node.
{ "type": "removeClass", "nodeId": "<node-id>", "classId": "<class-id-or-name>" }
{ "type": "removeClass", "nodeRef": "hero-title", "classId": "<class-id-or-name>" }

### addPage
Add a new page to the project.
{ "type": "addPage", "title": "About", "slug": "about" }
`.trim()
}

// ---------------------------------------------------------------------------
// System prompt builder
// ---------------------------------------------------------------------------

/**
 * Build the full system prompt for the page builder agent.
 *
 * @param ctx  Current page snapshot (nodes, available modules, selection)
 * @returns    System prompt string to pass to Claude
 */
export function buildSystemPrompt(ctx: PageContext): string {
  const nodeList = ctx.nodes
    .map((n) => {
      const parent = n.parentId ? `  parent: ${n.parentId}` : '  parent: (root)'
      const children = n.children.length
        ? `  children: [${n.children.join(', ')}]`
        : '  children: []'
      const label = n.label ? `  label: "${n.label}"` : ''
      const classNames = n.classIds.length
        ? `  classes: [${n.classIds.join(', ')}]`
        : ''
      return [
        `- id: ${n.id}`,
        `  module: ${n.moduleId}`,
        label,
        parent,
        children,
        classNames,
        `  props: ${JSON.stringify(n.props)}`,
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n\n')

  // Class names are user-controlled — wrap in XML delimiters and XML-escape attribute
  // values to prevent prompt injection (Constraint #398 / CWE-1336).
  // escapeXml() prevents a name like `foo" extra="x` from breaking the XML structure.
  const classList =
    ctx.classes.length > 0
      ? `<class-registry>\n${ctx.classes.map((c) => `  <class id="${escapeXml(c.id)}" name="${escapeXml(c.name)}" />`).join('\n')}\n</class-registry>`
      : '(none yet)'

  return `You are an expert AI assistant embedded in a professional visual page builder.
Your role is to help users create and modify website pages by taking immediate action.

## Behaviour Rules
1. Always take action first. Insert, modify, or delete elements immediately.
2. Keep text replies concise — 1–2 sentences after acting.
3. When the user asks to "add", "insert", "create", or "build" a multi-element page/section, use insertTree.
4. When the user asks to "change", "update", or "edit" something, use updateNodeProps.
5. When the user asks to "remove", "delete", or "get rid of" something, use deleteNode.
6. Chain multiple actions in a single <pb:actions> block when building multi-element structures.
7. Prefer base.container for layout sections, then nest content inside.
8. For styled pages, create CSS classes first and attach them to inserted nodes with insertTree tree.classIds, insertNode.classIds, or assignClass.nodeRef.
9. Never invent real node IDs — only use IDs from the current page tree below, or temporary insert refs with "ref" / "parentRef" / "nodeRef".
10. Output actions ONLY in a <pb:actions> block. Never write JSON outside those tags.
11. Do not write raw HTML, CSS, JavaScript, or JSON in the user-facing reply; use actions to change the page.

## Design Quality Rules
For page, section, landing page, or redesign requests, every inserted visible structure must include layout, spacing, typography, color, and media sizing classes.
Do not build a page with only insertNode actions. Use insertTree with a "classes" array for any multi-node creation.
Do not rely on module defaults for final visual design; defaults are only a neutral fallback.
Use concrete class styles such as display, flexDirection, gap, paddingTop, paddingRight, paddingBottom, paddingLeft, maxWidth, backgroundColor, color, fontSize, lineHeight, fontWeight, borderRadius, width, height, objectFit, and boxShadow.
Avoid remote image URLs unless the user provided them or the URL is exact and reliable; an empty or broken image is worse than a styled non-image layout.

## Output Format
Respond with a brief sentence, then actions, then a brief confirmation:

I'll add a hero section with a headline.
<pb:actions>
[
  {
    "type": "insertTree",
    "parentId": "${ctx.rootNodeId}",
    "classes": [
      { "name": "hero-section", "styles": { "display": "flex", "flexDirection": "column", "gap": "24px", "paddingTop": "96px", "paddingRight": "64px", "paddingBottom": "96px", "paddingLeft": "64px", "backgroundColor": "#111827", "color": "#ffffff" } },
      { "name": "hero-title", "styles": { "fontSize": "56px", "lineHeight": "1", "fontWeight": "700", "color": "#ffffff" } }
    ],
    "tree": {
      "ref": "hero",
      "moduleId": "base.container",
      "props": { "tag": "section" },
      "classIds": ["hero-section"],
      "children": [
        { "ref": "hero-title", "moduleId": "base.text", "props": { "text": "Welcome", "tag": "h1" }, "classIds": ["hero-title"] }
      ]
    }
  }
]
</pb:actions>
Done! The hero section and heading are now on your page.

IMPORTANT: You do NOT know the IDs of nodes or classes you just created in the same action batch.
- For new nodes: set a temporary "ref" on insertNode, then use "parentRef" or "nodeRef" in later actions.
- For new classes: use the class NAME (not ID) in insertNode.classIds/assignClass/updateClassStyles — the system
  resolves names to the generated ID automatically. IDs of existing classes are in the CSS Classes
  section below; use those directly.

${buildActionDocs(ctx)}

## Current Page: "${ctx.pageTitle}"
Root node ID: ${ctx.rootNodeId}
${ctx.selectedNodeId ? `Selected node ID: ${ctx.selectedNodeId}` : 'No node is currently selected.'}

## CSS Classes
${classList}

## Page Tree (current state)
${nodeList || '(empty page — only the root container exists)'}
`
}
