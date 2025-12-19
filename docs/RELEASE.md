# Release Process

This project uses [Nx Release](https://nx.dev/recipes/nx-release/get-started-with-nx-release) with semantic versioning and conventional commits.

## Configuration

The release configuration is defined in `nx.json` and uses:

- **Semantic Versioning**: Automatic version bumping based on commit types
- **Conventional Commits**: Structured commit messages that determine version bumps
- **Independent Versioning**: Each package can have its own version

## Commit Message Format

Follow the established commit message conventions:

| Prefix      | Emoji | Semver Bump | Description              |
| ----------- | ----- | ----------- | ------------------------ |
| `feat:`     | ✨    | **minor**   | New features             |
| `fix:`      | 🐞    | **patch**   | Bug fixes                |
| `perf:`     | ⚡    | **patch**   | Performance improvements |
| `refactor:` | 🛠️    | none        | Code refactoring         |
| `docs:`     | 📝    | none        | Documentation changes    |
| `test:`     | ✅    | none        | Test changes             |
| `build:`    | 📦    | none        | Build system changes     |
| `ci:`       | 🤖    | none        | CI/CD changes            |

### Breaking Changes

To trigger a **major** version bump, add `BREAKING CHANGE:` in the commit body or add `!` after the type:

```
feat!: ✨ redesign API interface

BREAKING CHANGE: The old API format is no longer supported
```

## Release Workflow

### 1. Preview the Release

Check what version bump will occur and what will be in the changelog:

```bash
pnpm release:version --dry-run
```

### 2. Create a Version

Bump versions and generate changelogs:

```bash
pnpm release:version
```

This will:

- Analyze commits since the last release
- Determine the new version based on conventional commits
- Update `package.json` versions
- Generate/update `CHANGELOG.md` files
- Create git tags
- Commit the changes

### 3. Publish (Optional)

If you want to publish to npm:

```bash
pnpm release:publish
```

### All-in-One Release

To version, changelog, and publish in one command:

```bash
pnpm release
```

## Advanced Options

### Specific Version Bump

Override automatic versioning:

```bash
# Bump to a specific version
nx release version 1.2.3

# Bump by semver type
nx release version major
nx release version minor
nx release version patch
```

### Prerelease Versions

Create alpha, beta, or rc versions:

```bash
nx release version prerelease --preid=alpha
nx release version prerelease --preid=beta
nx release version prerelease --preid=rc
```

### Skip Certain Steps

```bash
# Version without creating git tags
nx release version --skip-git-tag

# Generate changelog without versioning
pnpm release:changelog
```

### Target Specific Projects

```bash
nx release version --projects=@whiskmate/kitchen
```

## GitHub Releases

The configuration includes GitHub release creation. Make sure to:

1. Set up a GitHub personal access token with repo access
2. Add it as `GITHUB_TOKEN` environment variable or configure it in your CI/CD

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Release

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version bump type'
        required: true
        type: choice
        options:
          - auto
          - major
          - minor
          - patch

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: pnpm/action-setup@v2

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build packages
        run: nx run-many -t build

      - name: Release
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "actions@github.com"

          if [ "${{ github.event.inputs.version }}" = "auto" ]; then
            pnpm release
          else
            pnpm release version ${{ github.event.inputs.version }}
          fi
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Troubleshooting

### No commits found

If you see "No commits found since last release", make sure you have commits following the conventional commit format since your last tag.

### Version conflicts

If you have uncommitted changes, commit or stash them before running release commands.

### Failed to create GitHub release

Ensure your `GITHUB_TOKEN` has the necessary permissions and that you're authenticated with GitHub.
