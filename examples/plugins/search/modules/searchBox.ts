/**
 * instatic.search.search-box module
 *
 * Renders a search input with an inline dropdown for instant search results.
 * A small IIFE script handles the debounced fetch + DOM rendering.
 *
 * The script calls the plugin's public route:
 *   GET /admin/api/cms/plugins/instatic.search/runtime/search?q=…&per-page=5
 *
 * No React — runs in the publisher and editor canvas (no document/window API).
 * The script tag is injected in the render output so it executes on the
 * published page.
 */
import { control, defineModule, html } from '@core/plugin-sdk'

export default defineModule({
  id: 'instatic.search.search-box',
  name: 'Search Box',
  description: 'Instant-search input with dropdown results. Fetches from the Search plugin endpoint.',
  category: 'Search',
  version: '1.0.0',
  htmlTag: 'div',
  canHaveChildren: false,
  defaults: {
    placeholder: 'Search...',
    resultsPagePath: '/search',
    inputLabel: 'Search',
  },
  schema: {
    placeholder: control.text('Placeholder', {
      placeholder: 'Search...',
      description: 'Hint text shown inside the search input.',
    }),
    resultsPagePath: control.text('Results page path', {
      placeholder: '/search',
      description: 'URL of the full search-results page. "View all results" links here.',
    }),
    inputLabel: control.text('Input label', {
      placeholder: 'Search',
      description: 'Accessible label for the search input (visually hidden).',
    }),
  },
  render: ({ props }) => {
    const placeholder = String(props.placeholder ?? 'Search...')
    const resultsPagePath = String(props.resultsPagePath ?? '/search')
    const inputLabel = String(props.inputLabel ?? 'Search')

    const css = `
      .instatic-search-box{position:relative;font-family:inherit;}
      .instatic-search-box__label{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
      .instatic-search-box__input{display:block;width:100%;padding:10px 14px;border:1px solid var(--instatic-search-border,#d1d5db);border-radius:6px;font-size:1rem;font-family:inherit;background:var(--instatic-search-bg,#fff);color:var(--instatic-search-text,inherit);outline:none;box-sizing:border-box;}
      .instatic-search-box__input:focus{border-color:var(--instatic-search-focus,#2563eb);box-shadow:0 0 0 3px var(--instatic-search-focus-ring,rgba(37,99,235,0.2));}
      .instatic-search-box__dropdown{display:none;position:absolute;top:calc(100% + 4px);left:0;right:0;background:var(--instatic-search-bg,#fff);border:1px solid var(--instatic-search-border,#d1d5db);border-radius:6px;box-shadow:0 4px 16px rgba(0,0,0,0.12);z-index:200;overflow:hidden;}
      .instatic-search-box__dropdown.is-open{display:block;}
      .instatic-search-box__results{list-style:none;margin:0;padding:4px;}
      .instatic-search-box__result a{display:block;padding:8px 12px;border-radius:4px;text-decoration:none;color:inherit;}
      .instatic-search-box__result a:hover{background:var(--instatic-search-hover,#f3f4f6);}
      .instatic-search-box__result-title{display:block;font-size:0.925rem;font-weight:500;}
      .instatic-search-box__result-excerpt{display:block;font-size:0.8rem;color:var(--instatic-search-muted,#6b7280);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .instatic-search-box__viewall{display:block;padding:8px 12px;border-top:1px solid var(--instatic-search-border,#d1d5db);font-size:0.875rem;color:var(--instatic-search-accent,#2563eb);text-decoration:none;text-align:center;}
      .instatic-search-box__viewall:hover{background:var(--instatic-search-hover,#f3f4f6);}
      .instatic-search-box__empty{padding:12px;text-align:center;font-size:0.875rem;color:var(--instatic-search-muted,#6b7280);}
    `

    // Inline IIFE — debounced fetch, renders results into the dropdown.
    // Written without any ES2015+ features that wouldn't be in a tiny IIFE.
    const script = `
(function(){
  var ENDPOINT='/admin/api/cms/plugins/instatic.search/runtime/search';
  var RESULTS_PAGE='${resultsPagePath}';
  var PER_PAGE=5;
  var boxes=document.querySelectorAll('.instatic-search-box');
  boxes.forEach(function(box){
    var input=box.querySelector('.instatic-search-box__input');
    var dropdown=box.querySelector('.instatic-search-box__dropdown');
    var resultsList=box.querySelector('.instatic-search-box__results');
    var viewAll=box.querySelector('.instatic-search-box__viewall');
    if(!input||!dropdown||!resultsList||!viewAll)return;
    var timer=null;
    var lastQ='';
    function close(){dropdown.classList.remove('is-open');}
    function open(){dropdown.classList.add('is-open');}
    function render(hits,q){
      resultsList.innerHTML='';
      if(!hits||hits.length===0){
        var empty=document.createElement('div');
        empty.className='instatic-search-box__empty';
        empty.textContent='No results for "'+q+'"';
        resultsList.appendChild(empty);
      }else{
        hits.forEach(function(h){
          var li=document.createElement('li');
          li.className='instatic-search-box__result';
          var a=document.createElement('a');
          a.href=safeHref(h.slug||'#');
          a.innerHTML='<span class="instatic-search-box__result-title">'+escHtml(h.title||h.slug)+'</span>'
            +(h.excerpt?'<span class="instatic-search-box__result-excerpt">'+escHtml(h.excerpt)+'</span>':'');
          li.appendChild(a);
          resultsList.appendChild(li);
        });
      }
      viewAll.href=RESULTS_PAGE+'?q='+encodeURIComponent(q);
      viewAll.textContent='View all results →';
    }
    function escHtml(s){
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
    function safeHref(slug){
      return(slug.startsWith('/')||slug.startsWith('https://')||slug.startsWith('http://'))?slug:'#';
    }
    function doSearch(q){
      fetch(ENDPOINT+'?q='+encodeURIComponent(q)+'&per-page='+PER_PAGE)
        .then(function(r){return r.json();})
        .then(function(body){render(body.results,q);open();})
        .catch(function(){close();});
    }
    input.addEventListener('input',function(){
      var q=(input.value||'').trim();
      clearTimeout(timer);
      if(!q){close();return;}
      if(q===lastQ){open();return;}
      lastQ=q;
      timer=setTimeout(function(){doSearch(q);},250);
    });
    input.addEventListener('keydown',function(e){
      if(e.key==='Escape'){close();}
    });
    document.addEventListener('click',function(e){
      if(!box.contains(e.target)){close();}
    });
  });
})();
`

    return {
      html: html`
        <div class="instatic-search-box">
          <label class="instatic-search-box__label" for="instatic-search-input">${inputLabel}</label>
          <input
            class="instatic-search-box__input"
            id="instatic-search-input"
            type="search"
            placeholder="${placeholder}"
            aria-label="${inputLabel}"
            autocomplete="off"
          />
          <div class="instatic-search-box__dropdown" role="listbox" aria-label="Search results">
            <ul class="instatic-search-box__results" role="list"></ul>
            <a class="instatic-search-box__viewall" href="${resultsPagePath}?q=">View all results &rarr;</a>
          </div>
          <script>${script}</script>
        </div>
      `,
      css,
    }
  },
})
