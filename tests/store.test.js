import store from '../src/services/store';
import { RT_SUBMISSION_PREFIX, RT_MORE_OBJECT } from '../src/constants';

// constants
const submissionId = `${RT_SUBMISSION_PREFIX}1`;

beforeEach(() => {
  store.clearDataAction();
});

describe('store', () => {
  test('addSubmissionAction', () => {
    expect(store.state.submissionList).toHaveLength(0);
    expect(store.state.submissions[submissionId]).toBe(undefined);

    const submission = { data: { name: submissionId } };
    store.addSubmissionAction(submission);

    expect(store.state.submissionList).toHaveLength(1);
    expect(store.state.submissions[submissionId].data.name).toBe(submissionId);
    expect(store.state.submissions[submissionId].comments).toHaveLength(0);
    expect(store.state.submissions[submissionId].loading).toBe(false);
    expect(store.state.submissions[submissionId].error).toBe(false);
  });

  describe('comments', () => {
    beforeEach(() => {
      store.addSubmissionAction({ data: { name: submissionId } });
    });

    describe('addCommentAction', () => {
      test('top level comment', () => {
        expect(store.state.submissions[submissionId].comments).toHaveLength(0);

        // add comment
        const comment = {
          data: {
            parent_id: submissionId,
            name: 'c_1',
            depth: 0,
          },
        };
        store.addCommentAction(comment);

        // comment added to submission.comments
        expect(store.state.submissions[submissionId].comments).toHaveLength(1);

        // comment added to comments obj
        expect(store.state.comments.c_1.data.name).toBe('c_1');
        expect(store.state.comments.c_1.comments).toHaveLength(0);
        expect(store.state.comments.c_1.moreLoading).toBe(undefined);
      });

      test('child comment', () => {
        let comment = {
          data: {
            parent_id: submissionId,
            name: 'c_1',
            depth: 0,
          },
        };
        store.addCommentAction(comment);
        expect(store.state.comments.c_1.comments).toHaveLength(0);

        // add comment
        comment = {
          data: {
            parent_id: 'c_1',
            name: 'c_2',
            depth: 1,
          },
        };
        store.addCommentAction(comment);

        // comment added to comment.comments
        expect(store.state.comments.c_1.comments).toHaveLength(1);

        // comment added to comments obj
        expect(store.state.comments.c_2.data.name).toBe('c_2');
        expect(store.state.comments.c_2.comments).toHaveLength(0);
      });

      test('more object comment', () => {
        expect(store.state.submissions[submissionId].comments).toHaveLength(0);

        // add comment
        const comment = {
          data: {
            parent_id: submissionId,
            name: 'c_1',
            depth: 0,
          },
          kind: RT_MORE_OBJECT,
        };
        store.addCommentAction(comment);

        // comment added to submission.comments
        expect(store.state.submissions[submissionId].comments).toHaveLength(1);

        // comment added to comments obj
        expect(store.state.comments.c_1.data.name).toBe('c_1');
        expect(store.state.comments.c_1.comments).toBe(undefined);
        expect(store.state.comments.c_1.moreLoading).toBe(false);
      });
    });

    test('addComments', () => {
      // add comments
      const comments = [
        {
          data: {
            parent_id: submissionId,
            name: 'c_1',
            depth: 0,
            replies: {
              data: {
                children: [
                  {
                    data: {
                      parent_id: 'c_1',
                      name: 'c_2',
                      depth: 1,
                    },
                  },
                ],
              },
            },
          },
        },
        {
          data: {
            parent_id: submissionId,
            name: 'c_3',
            depth: 0,
          },
        },
      ];
      store.addComments(comments);

      // comment added to submission.comments
      expect(store.state.submissions[submissionId].comments).toHaveLength(2);

      // comment added to comments obj
      expect(store.state.comments.c_1.comments).toHaveLength(1);
      expect(store.state.comments.c_1).toBeTruthy();
      expect(store.state.comments.c_2).toBeTruthy();
      expect(store.state.comments.c_3).toBeTruthy();
      expect(store.state.comments.c_1.replies).toBe(undefined);
      expect(store.state.comments.c_2.replies).toBe(undefined);
      expect(store.state.comments.c_3.replies).toBe(undefined);
    });

    describe('removeLastCommentAction', () => {
      test('top level comment', () => {
        // add comment
        const comment = {
          data: {
            parent_id: submissionId,
            name: 'c_1',
            depth: 0,
          },
        };
        store.addCommentAction(comment);
        expect(store.state.submissions[submissionId].comments).toHaveLength(1);

        store.removeLastCommentAction(comment.data.parent_id);
        expect(store.state.submissions[submissionId].comments).toHaveLength(0);
        expect(store.state.comments[comment.name]).toBe(undefined);
      });

      test('child comment', () => {
        let comment = {
          data: {
            parent_id: submissionId,
            name: 'c_1',
            depth: 0,
          },
        };
        store.addCommentAction(comment);
        expect(store.state.comments.c_1.comments).toHaveLength(0);

        // add comment
        comment = {
          data: {
            parent_id: 'c_1',
            name: 'c_2',
            depth: 1,
          },
        };
        store.addCommentAction(comment);
        expect(store.state.comments.c_1.comments).toHaveLength(1);

        store.removeLastCommentAction(comment.data.parent_id);
        expect(store.state.comments.c_1.comments).toHaveLength(0);
        expect(store.state.comments[comment.name]).toBe(undefined);
      });
    });
  });
});
