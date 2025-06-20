import { Context } from "probot";
import { SLACK_URL } from "../constants.js"; // adjust the path as needed

export const pullRequestOpened = async (context: Context<"pull_request.opened">) => {
  const username = context.payload.pull_request.user.login;
  const { owner, repo } = context.repo();

  // Search for pull requests authored by the user in this repo
  const prs = await context.octokit.search.issuesAndPullRequests({
    q: `repo:${owner}/${repo} type:pr author:${username}`,
  });

  let body = `Thanks for opening this pull request!`;

  if (prs.data.total_count === 1) {
    body += ` 🎉\n\nYou're awesome! Since this is your first pull request, consider joining our Slack community: [Join Slack](${SLACK_URL})`;
  }

  await context.octokit.issues.createComment(
    context.issue({ body })
  );
};
