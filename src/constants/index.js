/**
 * @file App constants
 */


// Constants

export const APP_ID = 'at-app';
export const OPTIONS = {
  DEFAULT_TAB: 'comments-view',
  BACKUP_YT_TAB: true,
  NUM_POSTS: 10,
  NUM_COMMENTS: 200,
  DEFAULT_POSTS_SORT: 'comments',
  DEFAULT_COMMENTS_SORT: 'confidence', // best
  IGNORE_SUGGESTED_SORT: false,
  POST_COMMENT_THRESHOLD: 0,
  COMMENT_SCORE_THRESHOLD: -4,
  HIDE_CHILD_COMMENTS: false,
  SHOW_USER_FLAIR: true,
  SHOW_POST_FLAIR: true,
  FILTERS: [],
};
export const COMPONENT_TABS = [
  { text: 'reddit posts', value: 'submission-list' },
  { text: 'reddit comments', value: 'comments-view' },
  { text: 'YouTube comments', value: 'youtube-comments-view' },
];
export const POST_SORTS = [
  'comments',
  'top',
  'hot',
  'new',
  'relevance',
];
export const POST_TIMES = [
  { text: 'past hour', value: 'hour' },
  { text: 'past 24 hours', value: 'day' },
  { text: 'past week', value: 'week' },
  { text: 'past month', value: 'month' },
  { text: 'past year', value: 'year' },
  { text: 'all time', value: 'all' },
];
export const COMMENT_SORTS = [
  { text: 'best', value: 'confidence' },
  { text: 'top', value: 'top' },
  { text: 'new', value: 'new' },
  { text: 'controversial', value: 'controversial' },
  { text: 'old', value: 'old' },
  { text: 'q&a', value: 'qa' },
];

// Youtube ids, classes

export const YT_COMMENTS_ID = 'comments';
export const YT_NAVBAR_ID = 'masthead';

export const YT_LINK_CLASS = 'yt-simple-endpoint';
export const YT_CONTENT_RENDERER_CLASS = 'ytd-comment-renderer';

// Reddit api

export const DEFAULT_POSTS_TIME = 'all';
export const RT_MORE_OBJECT = 'more';
export const RT_SUBMISSION_PREFIX = 't3_';

export const RT_BASE_URL = 'https://old.reddit.com';
