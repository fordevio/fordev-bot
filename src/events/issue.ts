import { Context } from "probot";
import { SLACK_URL } from "../constants.js";


export const issueOpened = async (context: Context<"issues.opened">) => {
  const username = context.payload.issue.user.login;
  const { owner, repo } = context.repo();

  // Fetch all issues created by the user in this repo
  // TODO: It is deprecated to use search.issuesAndPullRequests, consider using issues.listForRepo
  const issues = await context.octokit.search.issuesAndPullRequests({
    q: `repo:${owner}/${repo} type:issue author:${username}`,
  });

  let body = `Thanks for opening this issue!`;

  if (issues.data.total_count === 1) {
    body += ` 🎉\n\nYou're awesome! Since this is your first issue, consider joining our Slack community: [Join Slack](${SLACK_URL})`;
  }

  await context.octokit.issues.createComment(
    context.issue({ body })
  );
};

export const issueComment = async (context: Context<"issue_comment.created">) => {
  const commentBody = context.payload.comment.body.trim();
  const commenter = context.payload.comment.user.login;

  if (commentBody === "/assign") {
    const { owner, repo } = context.repo();
    const issueNumber = context.payload.issue.number;

    await context.octokit.issues.addAssignees({
      owner,
      repo,
      issue_number: issueNumber,
      assignees: [commenter],
    });

    await context.octokit.issues.createComment(
      context.issue({ body: `✅ Assigned @${commenter} to this issue.` })
    );
  }
};
