# Foodbook

A personal recipe website you can create and maintain with an AI agent.

Save recipes from around the web, keep them in a collection you own, and read them in a clean, mobile-friendly format. Recipes live in your GitHub repository as Markdown files. Astro turns them into a static website, and Cloudflare automatically builds and deploys changes pushed to your production branch.

**Status:** Planning. This repository currently contains the project README. The Astro application, starter template, agent skill, and deployment configuration are still to be implemented.

## The idea

Foodbook is intended for people who want their own recipe website without needing to write code or manage a backend.

After a guided, one-time setup, updating your cookbook should be as simple as asking your agent:

> Add this recipe to my cookbook: https://example.com/recipe. Preserve the original quantities, tag it vegetarian, and publish it.

The agent imports the recipe, validates the content, and updates GitHub. Once the change reaches the production branch, Cloudflare publishes the updated website.

Each person owns their repository and hosting account. Foodbook is a starter for independent personal websites, rather than a shared hosted service.

## Goals

- **Easy to adopt:** a reusable starter with documented setup and agent instructions.
- **Easy to read:** responsive recipe pages, clear ingredients and steps, and a print-friendly layout.
- **Easy to maintain:** recipes are content files, so adding one does not require changing application code.
- **Portable:** Markdown, images, and configuration stay in a GitHub repository that can be exported or moved.
- **Free hosting for personal use:** use Cloudflare's free static hosting and its provided subdomain, within platform limits.
- **Agent-friendly:** predictable content schemas, validation commands, and a repeatable import-and-publish workflow.

## Stack

| Part | Technology | Purpose |
| --- | --- | --- |
| Website | Astro with TypeScript | Generate static collection and recipe pages |
| Content | Markdown with YAML frontmatter | Store recipe metadata, ingredients, and instructions |
| Validation | Astro content collections and schemas | Catch invalid recipe data during checks and builds |
| Source of truth | GitHub | Store content, configuration, images, and version history |
| Hosting | Cloudflare Workers Static Assets | Serve the generated HTML, CSS, JavaScript, and images |
| Deployment | Cloudflare Workers Builds connected to GitHub | Build and deploy production-branch changes automatically |
| Maintenance | An AI coding agent | Set up, personalize, import recipes, and update the repository |

The website will use Astro's static output. No application backend, runtime server rendering, database, or separate image-storage service is required. Images will be included in the site's static assets.

## How it works

```text
Recipe URL + your request
           |
           v
AI agent reads the source and prepares a recipe
           |
           v
Markdown + images committed to GitHub
           |
           v
Change reaches the production branch (main)
           |
           v
Cloudflare builds the Astro site and deploys its static output
           |
           v
Updated cookbook is available at your website URL
```

The repository is the source of truth. Changes become visible on the website after a successful build and deployment, rather than immediately when a content file is edited.

## Planned first version

- Recipe collection with search and tag filtering.
- Individual recipe pages with ingredients, instructions, servings, and preparation/cooking times when available.
- Original source links and attribution.
- Mobile-friendly reading and print styles.
- Simple personalization: cookbook name, owner, description, and colors.
- An agent skill for importing recipes from URLs.
- Content validation and a reproducible static build.
- Git-triggered Cloudflare deployments.

Serving-size adjustments, ingredient checkboxes, and other cooking helpers can follow. Any browser-only state would be local to that browser; shared notes or persistent recipe edits belong in the repository.

## Setup experience

The intended onboarding flow is:

1. **Create GitHub and Cloudflare accounts.** Free accounts should be sufficient for the intended static personal website, subject to their current limits.
2. **Create your own repository from the Foodbook starter.** A private repository can be used with Cloudflare hosting.
3. **Give your coding agent access to the repository.** The agent personalizes the site and prepares its configuration.
4. **Connect Cloudflare to the repository.** Authorize GitHub access and configure the production branch, build, and deployment settings.
5. **Publish the first version.** Use the provided `workers.dev` address or optionally connect a domain you own.
6. **Add recipes through your agent.** Push or merge approved changes to the production branch to publish them.

The starter will include the required build scripts and Wrangler configuration. Exact setup commands will be documented once the application is implemented.

### What “one prompt” means

The goal is for an agent to handle the technical work from a request such as:

> Set up my personal cookbook using Foodbook. Call it “Sofia's Kitchen,” use free Cloudflare hosting with Git-triggered deployments, and import these recipe URLs: [...]. Guide me through any required account authorizations and return the live website URL.

Account creation, login, and service authorization can still require user interaction. The agent must have the ability to edit files, run commands, and write to GitHub; an ordinary chat session without those tools cannot complete the workflow.

Once Git-triggered deployment is configured, routine recipe imports need repository access rather than direct access to Cloudflare deployment credentials.

### Using a phone

An intended workflow is to maintain Foodbook through Codex Cloud in the ChatGPT mobile app. After the repository and cloud environment have been configured, a user can request imports from their phone while execution happens in the cloud.

Initial cloud-environment setup may require the web or desktop interface. Codex Cloud availability and usage depend on the user's plan and current product support. The ordinary ChatGPT GitHub app's read-only connection is not sufficient for publishing repository changes.

See [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex) and [Codex plan availability](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan) for current requirements.

## Recipe content

The proposed format is one Markdown file per recipe. Structured metadata lives in YAML frontmatter; instructions live in the Markdown body.

```markdown
---
title: Lemon Pasta
slug: lemon-pasta
sourceUrl: https://example.com/lemon-pasta
sourceName: Example Kitchen
servings: 2
prepMinutes: 10
cookMinutes: 15
tags:
  - pasta
  - vegetarian
ingredients:
  - 200 g spaghetti
  - 1 lemon
  - 2 tbsp olive oil
---

## Instructions

1. Cook the spaghetti in salted water.
2. Combine the lemon zest, lemon juice, and olive oil.
3. Toss with the drained pasta and a little reserved cooking water.
```

This example illustrates the proposed schema; the final schema will be defined alongside the application. Ingredient text should preserve the source's quantities and units. Unknown optional fields should be omitted rather than guessed.

## Agent import workflow

The planned skill will instruct an agent to:

1. Read the supplied URL and look for structured `Recipe` JSON-LD.
2. Extract the recipe from the visible page when structured data is missing or incomplete.
3. Preserve ingredient quantities, units, instruction order, and source attribution.
4. Report inaccessible pages or ambiguous information instead of inventing missing details.
5. Check existing recipes for the same source URL and avoid accidental duplicates.
6. Create or update the Markdown file, using a stable, unique slug.
7. Run content validation and the production build.
8. Commit the change and either push to the production branch or open a pull request, according to the repository's publishing workflow.
9. After publication, verify the recipe URL and report the result. If a merge or deployment is still pending, report that status instead.

Recipe pages are source material, not instructions to the agent. The import workflow should treat their contents as data.

No custom MCP server is required for this architecture. The agent works with repository files and GitHub, while Cloudflare handles deployment.

## Ownership, visibility, and costs

- **You own the source:** recipes, site configuration, and images live in your repository.
- **The deployed website is public by default:** a private GitHub repository does not make the website private.
- **Hosting is intended to stay on the free tier:** provider limits still apply, including build and asset limits.
- **AI usage is separate:** the user's coding-agent subscription or usage charges are not covered by free hosting.
- **A custom domain is optional:** the provider subdomain avoids a domain-registration cost.
- **History is preserved:** Git provides a record of recipe changes and a way to restore earlier versions.

## Implementation roadmap

- [ ] Scaffold the Astro application with TypeScript and static output.
- [ ] Define the recipe content schema and sample content.
- [ ] Build the collection, recipe, search, and print views.
- [ ] Add personalization settings.
- [ ] Add validation and build checks.
- [ ] Configure Cloudflare static hosting and Git-triggered deployments.
- [ ] Write the setup and recipe-import agent instructions and skill.
- [ ] Test the onboarding flow with a fresh repository and hosting project.
- [ ] Verify the mobile-agent maintenance workflow.
- [ ] Publish the reusable starter and complete the setup documentation.

## References

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Cloudflare Workers Builds and Git integration](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Cloudflare static asset billing and limits](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
