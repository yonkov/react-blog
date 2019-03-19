const requester = method => {

return async (url, data, options) => {

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",

        },
        body: JSON.stringify(data),
        ...options,
    });
    return response.json();
};
};

export const get = requester("get");

export const post = requester("post");