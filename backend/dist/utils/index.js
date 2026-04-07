export const sendResponse = (res, status, message, data) => {
    const response = {
        code: status,
        message,
        data
    };
    return res.status(status).json(response);
};
//# sourceMappingURL=index.js.map