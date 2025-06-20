import { Probot } from "probot";
import { issueComment, issueOpened } from "./events/issue.js";
import { pullRequestOpened } from "./events/pull_request.js";


export default (app: Probot) => {
  app.on("issues.opened", issueOpened);
  app.on("pull_request.opened", pullRequestOpened);
  app.on("issue_comment.created", issueComment);
};
