export const createSharedLinkWithSettings = async (
  path: string,
  accessToken: string
): Promise<{ url: string }> => {
  const response = await fetch(
    "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path,
        settings: {
          access: "viewer",
          allow_download: true,
          audience: "public",
          requested_visibility: "public",
        },
      }),
    }
  );

  return await response.json();
};
