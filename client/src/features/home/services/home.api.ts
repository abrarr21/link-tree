import axios from 'axios';

const linkApiInstance = axios.create({
  baseURL: '/api/links',
});

export const getLink = async ({ username }: { username: string }) => {
  const response = await linkApiInstance.get(`/${username}`);
  console.log(response.data);
  return response.data;
};

export const linkClick = async ({ linkId }: { linkId: string }) => {
  const response = await linkApiInstance.patch(`/${linkId}/click`);
  return response.data;
};

export const linkDelete = async ({ linkId }: { linkId: string }) => {
  const response = await linkApiInstance.delete(`/${linkId}`);
  return response.data;
};

export const getAnalytics = async ({ user }: { user: string }) => {
  const response = await linkApiInstance.get(`/${user}/analytics`);
  return response.data;
};
