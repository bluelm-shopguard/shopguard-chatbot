# Web App vs QuickApp: Technical Differences & Migration Strategies

This guide summarizes the key technical differences between traditional web applications and QuickApps, specifically focusing on the migration of the ShopGuard chatbot.

## Architecture Comparison

| Aspect | Web App | QuickApp | Migration Strategy |
|--------|---------|----------|-------------------|
| **Entry Point** | HTML page (index.html) | app.ux + manifest.json | Convert HTML structure to app.ux template section |
| **UI Components** | HTML DOM elements | QuickApp components | Map HTML elements to QuickApp equivalents |
| **Styling** | CSS files | LESS in ux files | Convert CSS to LESS, adapt to component-based structure |
| **Scripting** | JavaScript files | Script section in ux files | Adapt to QuickApp lifecycle and component model |
| **Navigation** | Browser history API | Router module | Replace history API calls with router.push() |
| **Storage** | localStorage | @system.storage API | Create wrapper functions for storage operations |

## HTML Elements to QuickApp Components

| Web Element | QuickApp Component | Notes |
|-------------|-------------------|-------|
| `<div>` | `<div>` | Similar usage but different styling capabilities |
| `<p>` | `<text>` | In QuickApp, all text must be in `<text>` tags |
| `<span>` | `<text>` | Text styling differences apply |
| `<img>` | `<image>` | Note the name difference |
| `<button>` | `<input type="button">` | Different attributes and event handling |
| `<input>` | `<input>` | Similar but with QuickApp-specific attributes |
| `<textarea>` | `<textarea>` | Similar but with QuickApp-specific behavior |
| `<a>` | Not available | Use onclick events with router instead |
| `<ul>/<li>` | `<list>/<list-item>` | Different syntax and capabilities |

## Event Handling Differences

| Web | QuickApp | Example Migration |
|-----|----------|------------------|
| `addEventListener` | Declarative events | From: `element.addEventListener('click', fn)` <br> To: `<div onclick="fn">` |
| `event.target.value` | Event parameters | From: `function fn(e) { console.log(e.target.value) }` <br> To: `function fn(e) { console.log(e.value) }` |
| `preventDefault()` | Not applicable | Events work differently in QuickApp |
| Custom events | `$emit` and event listeners | Use component communication patterns instead |

## API Differences

| Web API | QuickApp API | Migration Strategy |
|---------|-------------|-------------------|
| `fetch()` | `@system.fetch` | Create wrapper functions with Promise interface |
| `localStorage` | `@system.storage` | Create async wrappers that handle Promise-based API |
| `navigator.language` | `@system.device` | Use device module to get system information |
| File API | `@system.media` | Use media module for image/file handling |

## Component Lifecycle Mapping

| Web | QuickApp | Notes |
|-----|----------|-------|
| `DOMContentLoaded` | `onInit` | Initialize components |
| `window.onload` | `onReady` | Called after component is rendered |
| Custom cleanup | `onDestroy` | Clean up resources |
| No equivalent | `onShow`, `onHide` | Handle visibility changes |
| No equivalent | `onBackPress` | Handle device back button |

## Styling System Differences

| Web CSS | QuickApp LESS | Notes |
|---------|--------------|-------|
| Global styles | Component-scoped styles | Styles in a component only affect that component |
| CSS variables | Limited support | Some advanced CSS features may not be available |
| Media queries | Limited support | Different approach to responsive design |
| Animations | `animation` property | Different syntax but similar concepts |
| Flexbox | Flexbox supported | Default layout is flexbox in QuickApp |
| `px` units | QuickApp units | Units are relative to screen density |

## Common Challenges & Solutions

### Challenge 1: DOM Manipulation
**Web App:**
```javascript
document.getElementById('message').innerText = 'Hello';
```

**QuickApp Solution:**
```javascript
// In data section
data: {
  messageText: 'Hello'
}

// In template
<text>{{messageText}}</text>
```

### Challenge 2: Event Propagation
**Web App:**
```javascript
document.body.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    handleItemClick(e.target.dataset.id);
  }
});
```

**QuickApp Solution:**
```html
<div for="{{items}}" onclick="handleItemClick($item.id)">
  <text>{{$item.name}}</text>
</div>
```

### Challenge 3: Theme Switching
**Web App:**
```javascript
document.body.classList.toggle('dark-theme', isDarkMode);
```

**QuickApp Solution:**
```javascript
// Use conditional class binding in template
<div class="container {{isDarkMode ? 'dark-theme' : ''}}">

// Or update global theme state and use computed properties
computed: {
  themeClass() {
    return globalData.theme.current === 'dark' ? 'dark-theme' : '';
  }
}
```

### Challenge 4: Async Operations
**Web App:**
```javascript
async function getData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}
```

**QuickApp Solution:**
```javascript
function getData() {
  return new Promise((resolve, reject) => {
    fetch.fetch({
      url: '/api/data',
      success: (response) => {
        resolve(JSON.parse(response.data));
      },
      fail: (err, code) => {
        reject({ err, code });
      }
    });
  });
}
```

## Performance Considerations

1. **Memory Management**
   - Web: Browser handles garbage collection
   - QuickApp: More limited environment, be careful with large data sets

2. **Animation Performance**
   - Web: Hardware acceleration available
   - QuickApp: Optimize animations, use sparingly

3. **API Calls**
   - Web: Various optimization techniques available
   - QuickApp: Implement caching and request batching

4. **Render Optimization**
   - Web: Virtual DOM in frameworks
   - QuickApp: Be mindful of list rendering and component updates

## Testing & Debugging

1. **Web App:**
   - Browser DevTools
   - Various testing frameworks
   - Console logging

2. **QuickApp:**
   - QuickApp IDE debugging tools
   - Limited console capabilities
   - Testing on actual devices is crucial

## Conclusion

Migrating from a web application to QuickApp requires significant adjustments to your development approach, but the component-based architecture of QuickApp makes the transition relatively straightforward for developers with web framework experience (like Vue.js or React).

Focus on understanding the component lifecycle, event system, and API differences. By following the patterns in this guide and leveraging the existing QuickApp examples, you can successfully convert your web-based chatbot to a fully functional QuickApp.
