---
title: "Git"
order: 8
lang: "bash"
---

# What is your experience with GitHub?

- **Version Control**: Managed version control for collaborative projects. Created, maintained, and merged branches.
- **Collaboration**: Pull requests, code reviews, feedback on teammates' PRs.
- **Code Hosting & Deployment**: Hosted repositories, deployed static sites with GitHub Pages, integrated with CI/CD tools (Jenkins).
- **Documentation**: README files, detailed commit messages, changelogs.
- **Conflict Resolution**: Experienced in resolving merge conflicts.

# Basic commands (pushing to repo, pulling from repo)

```bash
# Clone a remote repository
git clone <repository-url>

# Stage all changes
git add .

# Commit staged changes
git commit -m "Added feature X"

# Push local commits to remote
git push

# Fetch and merge latest changes from remote
git pull

# Show current state of working directory
git status

# Branch operations
git branch                  # List branches
git branch <name>           # Create a branch
git branch -d <branch-name> # Delete branch

# Switch branches
git checkout <branch-name>    # Switch to a branch
git checkout -b <new-branch>  # Create and switch to a branch

# Merge changes from another branch
git merge <branch-name>

# Show commit history
git log
```

# What is a branch?

- **Git Branching** enables developers to work on features, bug fixes, or experiments in isolation.
- **Key Concepts**:
    - **Main Branch**: The default, stable branch (`main` or `master`).
    - **Branching**: Create separate timelines for new features without impacting main.
    - **Merging**: Combine changes from a branch back into main.
- **Benefits**: Isolation, Collaboration, Experimentation, Efficient Merging.

# How to merge a branch?

```bash
# 1. Switch to the target branch
git checkout main

# 2. Get latest changes
git pull

# 3. Merge the source branch
git merge feature-login

# 4. If conflicts exist, resolve them then:
git add <resolved-file>
git commit
```

- If there are conflicting changes, Git pauses the merge and highlights conflicts.
- Edit conflicting files, stage resolved files, then commit.

# What is CI/CD?

## Continuous Integration (CI)

- Developers regularly merge code into a central repository, which is automatically built and tested.
- **Key Processes**: Push to repo → Automated build → Unit/integration tests.
- **Benefits**: Early bug detection, encourages frequent integration, maintains updated application.

```bash
# CI Tools: Jenkins, GitLab CI/CD, CircleCI
# Testing Frameworks: JUnit, Selenium
```

## Continuous Delivery (CDelivery)

- Builds on CI by automating preparation for production. Application is built, tested, and deployed to staging. Human intervention needed for production deployment.
- **Key Processes**: CI passes → Deploy to staging → End-to-end/performance/UAT testing → Manual production deploy.

## Continuous Deployment (CDeployment)

- Extends Delivery by automating deployment to production. If staging tests pass, code is automatically pushed to production.
- **Benefits**: Rapid iteration, frequent releases, reduced human error.

```bash
# Automation Tools: Jenkins, GitLab CI/CD, Spinnaker, AWS CodeDeploy
```
