import { UserToTopics } from '../entities/user-to-topics.entity';

export const transformUserToTopicsToTopicKeys = (
  userToTopics: UserToTopics[],
) => {
  return userToTopics.map((item) => item.topicKey);
};
