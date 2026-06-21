import { getAnalytics, getLink, linkClick, linkDelete } from '../services/home.api';

export const useHome = () => {
  const fetchLinks = async ({ username }: { username: string }) => {
    try {
      const links = await getLink({ username });
      console.log(links);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLinkClick = async ({ linkId }: { linkId: string }) => {
    try {
      const response = await linkClick({ linkId });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteLink = async ({ linkId }: { linkId: string }) => {
    try {
      const response = await linkDelete({ linkId });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const fetchAnalytics = async ({ user }: { user: string }) => {
    try {
      const response = await getAnalytics({ user });
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    fetchLinks,
    handleLinkClick,
    handleDeleteLink,
    fetchAnalytics,
  };
};
