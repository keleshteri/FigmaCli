# figma-cli

> A full-featured, cross-platform command-line interface for Figma.  
> Work with files, components, design tokens, exports, comments, and more — entirely from your terminal.

---

## What is this?

`figma-cli` is a standalone CLI tool that gives you complete programmatic access to the Figma REST API.  
No browser. No AI assistant. No plugins required.  
Just you, your terminal, and your Figma files.

Think of it as the `git` for Figma — version-aware, scriptable, and designed to fit inside any developer workflow (CI/CD, design system pipelines, token sync, automated exports).

---

## Highlights

- Full Figma REST API coverage (files, components, styles, variables, exports, comments, webhooks)
- Design token export in 10+ formats: CSS, DTCG, Tailwind v3/v4, SCSS, TypeScript, JSON, Style Dictionary
- Batch export of assets (PNG, SVG, PDF) at any scale
- Version history inspection and diff between file versions
- Watch mode for polling file changes
- Interactive prompts for complex operations
- Scriptable JSON output for pipeline use
- Works on macOS, Linux, and Windows
- Install globally with a single command

---

## Installation

```bash
# via npm (recommended)
npm install -g @figma/figma-cli

# via Homebrew (macOS/Linux)
brew install figma-cli

# via Scoop (Windows)
scoop install figma-cli

# via direct binary download (no Node.js required)
# See: Releases page on GitHub
```

After install, verify it works:

```bash
figma --version
figma --help
```

---

## Authentication

```bash
# Interactive login — opens browser for OAuth (recommended)
figma auth login

# Login with a Personal Access Token
figma auth login --token YOUR_PAT

# Show the currently authenticated user
figma auth whoami

# Log out
figma auth logout
```

Credentials are stored securely in your OS keychain (macOS Keychain, Windows Credential Manager, Linux SecretService/keyring).

---

## Command Reference

### File Commands

```bash
figma file get <file-key>                  # Get full file JSON
figma file info <file-key>                 # File metadata (name, last modified, owner)
figma file list                            # List your recent/starred files
figma file history <file-key>             # View version history
figma file diff <file-key> <v1> <v2>      # Compare two versions
figma file open <file-key>                # Open file in browser
```

### Component Commands

```bash
figma components list <file-key>           # List all components in a file
figma components get <component-key>       # Get a component by its key
figma components export <file-key>         # Export component specs as JSON/Markdown
figma components inspect <file-key> <node-id>  # Deep inspect a specific node
```

### Design Token / Variable Commands

```bash
figma tokens get <file-key>                # Get all variables/tokens (raw JSON)
figma tokens export <file-key>             # Export tokens to files
  --format css|dtcg|tailwind|scss|ts|json  # Output format (default: dtcg)
  --output ./tokens/                       # Output directory
  --mode light|dark                        # Variable mode to export
  --collection "Core Tokens"               # Filter by collection name

figma tokens sync <file-key>               # Sync remote tokens → local files (diff-aware)
  --output ./tokens/
  --format dtcg

figma tokens diff <file-key>               # Show what changed vs your local token files
  --local ./tokens/

figma tokens watch <file-key>             # Poll for token changes and auto-sync
  --interval 30                           # Seconds between checks (default: 30)
```

### Export / Asset Commands

```bash
figma export <file-key>                    # Export nodes from a file
  --node <node-id>                        # Target a specific node
  --format png|svg|pdf|webp               # Output format (default: png)
  --scale 1|1.5|2|3|4                     # Export scale (default: 1)
  --output ./assets/                       # Output directory

figma export batch <file-key>             # Export all nodes marked as exportable
  --format svg
  --output ./icons/

figma export frame <file-key> <frame-name>  # Export a named frame by name
```

### Style Commands

```bash
figma styles list <file-key>              # List all styles (color, text, effect, grid)
figma styles export <file-key>            # Export styles
  --format css|json|scss                  # Output format
  --output ./styles/
```

### Comment Commands

```bash
figma comments list <file-key>            # List all comments on a file
figma comments add <file-key>             # Add a comment
  --message "Looks great!"
  --node <node-id>                        # Attach to a specific node (optional)
figma comments resolve <comment-id>       # Resolve a comment
figma comments delete <comment-id>        # Delete a comment
```

### Team & Project Commands

```bash
figma team info <team-id>                 # Get team information
figma team projects <team-id>             # List all projects in a team
figma project files <project-id>          # List files in a project
```

### Webhook Commands

```bash
figma webhooks list                        # List all webhooks for your team
figma webhooks create                      # Create a webhook (interactive)
  --team <team-id>
  --event FILE_UPDATE|LIBRARY_PUBLISH|...
  --endpoint https://your.server/hook
figma webhooks delete <webhook-id>         # Delete a webhook
figma webhooks test <webhook-id>           # Send a test ping
```

### Watch / Live Commands

```bash
figma watch <file-key>                     # Poll a file for changes and report diffs
  --interval 15                           # Polling interval in seconds
  --on-change "npm run token-sync"        # Shell command to run on change
```

### Search Commands

```bash
figma search <query>                      # Search files across your teams
  --type file|component|style            # Filter by result type
  --team <team-id>                        # Scope to a team
```

---

## Global Flags

| Flag | Description |
|------|-------------|
| `--json` | Output raw JSON (useful for piping to `jq`) |
| `--quiet` | Suppress decorative output, only print results |
| `--token <pat>` | Override auth with a PAT for this command only |
| `--config <path>` | Use a custom config file |
| `--no-color` | Disable colored output |
| `--debug` | Enable verbose debug logging |

---

## Scripting & CI/CD

Because every command supports `--json` and exits with proper exit codes, `figma-cli` is designed to be scripted:

```bash
# Get file info in CI
file_name=$(figma file info $FILE_KEY --json | jq -r '.name')

# Sync tokens on every PR
figma tokens sync $FILE_KEY --output ./tokens/ --format dtcg

# Export all SVG icons to assets folder
figma export batch $FILE_KEY --format svg --output ./src/assets/icons/

# Run token sync when Figma file changes (webhook-driven shell script)
figma webhooks create --event FILE_UPDATE --endpoint https://ci.example.com/webhook
```

---

## Configuration File

Create a `.figmarc` or `figma.config.json` in your project root:

```json
{
  "fileKey": "abc123xyz",
  "tokenFormat": "dtcg",
  "tokenOutput": "./tokens/",
  "exportOutput": "./assets/",
  "defaultScale": 2,
  "watchInterval": 30
}
```

`figma-cli` will automatically pick up this config when run inside the project directory.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `FIGMA_TOKEN` | Personal access token (overrides stored auth) |
| `FIGMA_FILE_KEY` | Default file key for commands that require one |
| `FIGMA_TEAM_ID` | Default team ID |
| `FIGMA_CONFIG` | Path to config file |

---

## Supported Token Export Formats

| Format | Flag | Output |
|--------|------|--------|
| DTCG JSON | `dtcg` | `tokens.json` — W3C Design Token standard |
| CSS Variables | `css` | `tokens.css` — `--color-primary: #fff;` |
| SCSS Variables | `scss` | `tokens.scss` — `$color-primary: #fff;` |
| Tailwind v4 | `tailwind4` | CSS-first Tailwind config |
| Tailwind v3 | `tailwind3` | `tailwind.config.js` theme extension |
| TypeScript | `ts` | Typed constant object |
| JSON Flat | `json-flat` | Single-level key-value pairs |
| JSON Nested | `json-nested` | Hierarchical JSON object |
| Style Dictionary v3 | `style-dictionary` | Multi-platform token source |
| Tokens Studio | `tokens-studio` | Compatible with Tokens Studio plugin |

---

## Platform Support

| Platform | Install Method | Notes |
|----------|---------------|-------|
| macOS (Intel + Apple Silicon) | npm, Homebrew, binary | Full support |
| Linux (x64, arm64) | npm, binary | Full support |
| Windows (x64) | npm, Scoop, binary, .exe | Full support |

The binary distribution bundles a Node.js runtime — no separate Node.js install required.

---

## Comparison: figma-cli vs Figma MCP

| | figma-cli | Figma MCP |
|--|-----------|-----------|
| How it's used | Your terminal | AI assistant (Claude, etc.) |
| Scripting / CI | Yes | No |
| Requires AI | No | Yes |
| Requires Figma plugin | No | Yes (Desktop Bridge) |
| Offline file parsing | Planned | No |
| Interactive prompts | Yes | N/A |
| Global install | Yes | No |

---

## License

MIT
