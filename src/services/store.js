/**
 * @file Global store: simple state management
 */


import Vue from 'vue';
import { search, getComments, getMoreComments } from './api';
import { RT_SUBMISSION_PREFIX, RT_MORE_OBJECT } from '../constants';


const emptyDataObject = {
  loading: false,
  error: false,
};

const emptyMoreDataObject = {
  moreLoading: false,
  moreError: false,
};

export default {
  state: {
    submissionList: [],
    submissions: { ...emptyDataObject, ...emptyMoreDataObject },
    comments: {},
    nextSubmission: null,
    init: false,
  },
  setInitAction(value) {
    this.state.init = value;
  },
  addSubmissionAction(submission) {
    Vue.set(
      this.state.submissions,
      submission.data.name,
      { ...submission, ...emptyDataObject, comments: [] },
    );
    this.state.submissionList.push(submission.data.name);
  },
  clearDataAction() {
    this.state.submissions = { ...emptyDataObject, ...emptyMoreDataObject };
    this.state.submissionList = [];
    this.state.comments = {};
    this.state.nextSubmission = null;
    this.state.init = false;
  },
  addCommentAction(comment) {
    const parentId = comment.data.parent_id;
    const commentName = comment.data.name;

    // Add comment to store
    if (comment.kind === RT_MORE_OBJECT) {
      Vue.set(this.state.comments, commentName, { ...comment, ...emptyMoreDataObject });
    } else {
      Vue.set(this.state.comments, commentName, { ...comment, comments: [] });
    }

    // add comment id/name to parent object (submission/comment obj)
    if (!comment.data.depth) {
      // top level comment -> comment is a direct child of a submission
      this.state.submissions[parentId].comments.push(commentName);
    } else {
      // comment is a child of another comment
      this.state.comments[parentId].comments.push(commentName);
    }
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
  removeLastCommentAction(id) {
    let commentId;

    // pop last child comment from object
    if (id.substring(0, 3) === RT_SUBMISSION_PREFIX) {
      commentId = this.state.submissions[id].comments.pop();
    } else {
      commentId = this.state.comments[id].comments.pop();
    }

    // remove comment from store
    Vue.delete(this.state.comments, commentId);
  },
  loadSubmissions(query, sort, limit, after = null) {
    if (after) {
      this.state.submissions.moreLoading = true;
      this.state.submissions.moreError = false;
    } else {
      this.clearDataAction();
      this.state.submissions.loading = true;
    }
    return search(query, sort, limit, after)
      .then((data) => {
        this.state.nextSubmission = data.nextSubmission;
        data.submissions.forEach((submission) => this.addSubmissionAction(submission));
        return Promise.resolve();
      })
      .catch(() => {
        if (after) {
          this.state.submissions.moreError = true;
        } else {
          this.state.submissions.error = true;
        }

        return Promise.reject();
      })
      .finally(() => {
        this.state.submissions.loading = false;
        this.state.submissions.moreLoading = false;
      });
  },
  loadComments(submissionId, submissionName, limit) {
    if (this.state.submissions[submissionName].comments.length
      || this.state.submissions[submissionName].loading
    ) {
      return Promise.resolve();
    }

    this.state.submissions[submissionName].loading = true;
    this.state.submissions[submissionName].error = false;
    return getComments(submissionId, limit)
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
  loadMoreComments(submissionId, more) {
    this.state.comments[more.name].moreLoading = true;
    this.state.comments[more.name].moreError = false;
    return getMoreComments(submissionId, more.children)
      .then((comments) => {
        this.removeLastCommentAction(more.parent_id);
        this.addComments(comments);
        return Promise.resolve();
      })
      .catch(() => {
        this.state.comments[more.name].moreError = true;
        this.state.comments[more.name].moreLoading = false;
        return Promise.reject();
      });
  },
};
