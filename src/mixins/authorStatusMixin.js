import { AT_LINK_CLASS } from '../constants';

export default {
  methods: {
    authorClass(distinguished, isSubmitter) {
      return {
        [AT_LINK_CLASS]: !isSubmitter && !distinguished,
        moderator: distinguished === 'moderator',
        admin: distinguished === 'admin',
        special: distinguished === 'special',
        op: !distinguished && isSubmitter,
      };
    },
    getAuthorStatus(distinguished, isSubmitter) {
      const status = [];

      if (isSubmitter) {
        status.push('S');
      }
      switch (distinguished) {
        case 'moderator':
          status.push('M');
          break;
        case 'admin':
          status.push('A');
          break;
        case 'special':
          status.push('Δ');
          break;
        default:
          break;
      }

      return status.length ? `[${status}]` : '';
    },
  },
};
