# bluelm-shopguard quickapp frontend

main project

[https://github.com/bluelm-shopguard/bluelm-shopguard](https://github.com/bluelm-shopguard/bluelm-shopguard)

## dev env

- **OS**: Ubuntu 24.04 LTS (via WSL2)
- **Kernel**: 6.6.87.1-microsoft-standard-WSL2
- **CPU**: Intel(R) Core(TM) Ultra 9 185H
- **GPU**: NVIDIA GeForce RTX 4060 / Intel Arc
- **Shell**: zsh 5.9

## general todos

- [x] general outline of README
- [x] what makes up a chatbot interface
- [x] compare interface of different products
- [x] design
<!-- - [ ] design in figma -->
- [ ] full design
- [ ] quickapp page
- [ ] quickapp program
- [ ] test on vivo machine

## setup

### configuration

Simply edit the configuration files directly:

1. **System settings**: Edit `src/data/system-settings.js` for API endpoints, app settings, and feature flags
2. **User settings**: The `src/data/user-settings.js` handles user preferences automatically

**Example - updating API endpoint:**
```javascript
// In src/data/system-settings.js
export let SystemSettings = {
  api: {
    endpoint: "https://your-api-endpoint.com/v1/chat/completions",
    model: "your-model-name",
    // ... other settings
  },
  // ... rest of config
};
```

### settings structure

The application uses a simple two-file settings system:

- **`src/data/user-settings.js`** - User preferences (theme, language, chat history)
  - Automatically saved to localStorage
  - Can be modified through the settings UI
  - Persists across browser sessions

- **`src/data/system-settings.js`** - System configuration (API endpoints, features, messages)
  - Edit directly in the file for different environments
  - Contains all system-level configuration
  - Version controlled - changes apply to all users



## basis analysis

goal: developing for bluelm-shopguard quickapp
viewport: typical mobile phone, like 1080x2340
target audience: normal Chinese phone users, who may use AI app like doubao

### requirement

help user identify fake ad and misleading promotion
interface needs to be simple
hide the background process;
supports tools like image input (camera), websearch, reading webpage

### tech stack

quickapp for frontend page and quickapp on phone

## comparison of popular apps

existing chatbot app interface, see [refenrences](doc/reference/chatbot-apps/)

good domestic products are deepseek and kimi

kimi has a friendly welcome message at opening page
lots of tools including phone call and camera

deepseek has a simple welcome message
tools are limited to "DeepThink" and "Search" (not multimodal)

## design

### interface design

#### homepage design

##### layout

top
content
bottom
left sidebar

##### top

sidebar button, product name or conversation topic (if available), new chat button

##### content

startup:
poster
chatbot pfp
welcome message

in conversation:
message in turn, scrollbar

##### bottom

tools

input
input area, send button

#### sidebar design

history conversation list

setting button

#### setting menu design

account (sign in)
user character
theme
language
toggle background

## full design

[full-design-image](doc/full-design.png)

[full-design-html](doc/full-design.html)

### program design

webpage with .ux
css
interaction logic, js
how to call backend service
how to parse string to markdown
how to display markdown answer on screen
how to enable user to change settings
how to manage accounts
how to manage accounts data

## references

[https://github.com/ChatGPTNextWeb/NextChat](https://github.com/ChatGPTNextWeb/NextChat)

[https://deepwiki.com/ChatGPTNextWeb/NextChat](https://deepwiki.com/ChatGPTNextWeb/NextChat)

[https://github.com/nomic-ai/gpt4all](https://github.com/nomic-ai/gpt4all)
