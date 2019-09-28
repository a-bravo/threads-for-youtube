/**
 * @file Global store: simple state management
 */


import { search, getComments } from './api';


const emptyDataObject = {
  loading: false,
  error: false,
};

const emptyMoreDataObject = {
  moreLoading: false,
};

export default {
  state: {
    submissionList: [],
    submissions: { ...emptyDataObject, ...emptyMoreDataObject },
    comments: {},
    nextSubmission: null,
  },
  setSubmissionLoadAction(value) {
    this.state.submissions.loading = value;
  },
  addSubmissionAction(submission) {
    this.state.submissions[submission.data.name] = {
      ...submission,
      ...emptyDataObject,
      comments: [],
    };
    this.state.submissionList.push(submission.data.name);
  },
  clearDataAction() {
    this.state.submissions = { ...emptyDataObject, ...emptyMoreDataObject };
    this.state.submissionList = [];
    this.state.comments = {};
    this.state.nextSubmission = null;
  },
  addCommentAction(comment) {
    const parentId = comment.data.parent_id;
    const commentName = comment.data.name;

    // add comment id/name to parent object (submission/comment obj)
    if (!comment.data.depth) {
      // top level comment -> comment is a direct child of a submission
      this.state.submissions[parentId].comments.push(commentName);
    } else {
      // comment is a child of another comment
      this.state.comments[parentId].comments.push(commentName);
    }

    // Add comment to comments table
    this.state.comments[commentName] = comment;
    this.state.comments[commentName].comments = [];
  },
  addComments(comments) {
    comments.forEach((comment) => {
      this.addCommentAction(comment);

      // add children recursively
      if (comment.data.replies) {
        this.addComments(comment.data.replies.data.children);
      }
      // remove replies from object
      delete this.state.comments[comment.data.name].data.replies;
    });
  },
  loadSubmissions(query, sort, limit, after = null) {
    if (after) {
      this.state.submissions.moreLoading = true;
    } else {
      this.clearDataAction();
      this.state.submissions.loading = true;
    }
    return search(query, sort, limit, after)
      .then((data) => {
        this.state.nextSubmission = data.nextSubmission;
        data.submissions.forEach(submission => this.addSubmissionAction(submission));
        return Promise.resolve();
      })
      .catch(() => {
        if (!after) {
          this.state.submissions.error = true;
        }

        return Promise.reject();
      })
      .finally(() => {
        this.state.submissions.loading = false;
        this.state.submissions.moreLoading = false;
      });
  },
  loadComments(submissionId, submissionName) {
    if (this.state.submissions[submissionName].comments.length
      || this.state.submissions[submissionName].loading
    ) {
      return Promise.resolve();
    }

    this.state.submissions[submissionName].loading = true;
    this.state.submissions[submissionName].error = false;
    return getComments(submissionId)
      .then((comments) => {
        this.addComments(comments);
        return Promise.resolve();
      })
      .catch(() => {
        this.state.submissions[submissionName].error = true;
        return Promise.reject();
      })
      .finally(() => { this.state.submissions[submissionName].loading = false; });
  },
};
