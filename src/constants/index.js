/**
 * @file App constants
 */


// Constants

export const APP_ID = 'at-app';
export const OPTIONS = {
  DEFAULT_TAB: 'comments-view',
  BACKUP_YT_TAB: true,
  NUM_POSTS: 10,
  POST_COMMENT_THRESHOLD: 0,
  COMMENT_SCORE_THRESHOLD: -4,
  SHOW_USER_FLAIR: true,
  SHOW_POST_FLAIR: true,
};
export const COMPONENT_TABS = [
  { text: 'reddit posts', value: 'submission-list' },
  { text: 'reddit comments', value: 'comments-view' },
  { text: 'YouTube comments', value: 'youtube-comments-view' },
];

// Youtube ids, classes

export const YT_COMMENTS_ID = 'comments';
export const YT_NAVBAR_ID = 'masthead';

export const YT_LINK_CLASS = 'yt-simple-endpoint';
export const YT_CONTENT_RENDERER_CLASS = 'ytd-comment-renderer';
