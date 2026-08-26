# How to contribute to the project

This document outlines the expected workflow for contributors to the project.

## Getting started

1. If you are one of Amy's research students, make sure you've been added as a contributor to the repository!
2. Make sure you have a code editor (VSCode, VSCodium, etc) installed.
3. Clone this repository.
4. Follow the steps listed in [this article](https://docs.expo.dev/get-started/set-up-your-environment/) to set up an Expo Go environment on your computer. Expo Go will run a device simulator that allows you to develop the app live.
5. In order to run this project on your own device, you will need to make sure you have downloaded all external packages that are used in our code. To check if you need to install any, run `npx expo go`. If you encounter any error messages in the terminal about a missing package when this command executes, install the specified missing packages with `npm install <missing-package>`. Repeat this process until you have installed all missing packages and you can run `npx expo go` without issue.
6. [Create a branch](https://www.geeksforgeeks.org/git/how-to-create-a-new-branch-in-git/) for yourself. This is where you will do all of your development work on this project. Give the branch a descriptive name -- I suggest something that indicates the feature you plan to work on. Examples:

    ```bash
    git checkout -b login
    git checkout -b faq
    ```

7. If there is already a branch for the feature you plan to work on, check out that branch instead; for example: `git checkout login`

8. New to git and GitHub? [Check out this tutorial](https://www.baeldung.com/ops/git-guide).

## Workflow

- Start each session by performing a `git pull` on your branch, to fetch and merge the latest changes. For instance, if I'm working on the `faq` branch: `git pull origin faq`
- Develop and test your code as you normally would. (You will likely be using the Expo Go simulator for this.)
- Stage your changes using `git add <filename>` for each modified file.
- Once you're done (for the day, or with a specific development task), [commit your changes](https://github.com/git-guides/git-commit).
- Before pushing, pull down the latest changes for your branch (`git pull origin <branch>`). Resolve any merge conflicts.
- Push your changes to the remote repo (`git push origin <branch>`).

### Merging a feature into the main branch

Once you've completed a bug fix, fully implemented a feature, etc., it's time to merge that feature into the main branch of the repository. Here's how to do that:

- Make sure all of your code has been commmitted and pushed to your branch.
- You remembered to thoroughly test your code first, right?
- Issue a [pull request](https://github.blog/developer-skills/github/beginners-guide-to-github-creating-a-pull-request/). This will signal to Amy that you have code that's ready for review.
- We will conduct a code review at the next scheduled research meeting.
- Once your code has been reviewed, and assuming everything looks good, Amy will accept your pull request.
- Otherwise, I'll send the code back to you for revisions.

## Best practices

- Get in the habit of pulling your branch at the start of every work session, even if you are the only one working on your branch!
- If more than one person is working on a branch, make sure you're communicating with each other frequently. This will avoid unnecessarily repeated work and, hopefully, most merge conflicts.
- If you do encounter a [merge conflict](https://www.geeksforgeeks.org/git/merge-conflicts-and-how-to-handle-them/):
  - Run `git status` to see which files are affected.
  - Open each affected file in your code editor.
  - Look for the `<<<<<<< HEAD` marker(s) -- this indicates the start of a merge conflict. You'll see something like this:

    ```text
    <<<<<<< HEAD
    version of the content in the remote repo
    =======
    version of the content in the local repo
    >>>>>>> branch-name
    ```

  - Edit the file(s) so that they contain the content you want / expect. (Make sure you remove the merge conflict markings!)
  - Add, commit, and push your changes.
  