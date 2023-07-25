function asyncHandler(requestHandler: Function) {
    return async (req: any, res: any, next: any) => {
        try {
            await requestHandler(req, res);
        } catch (err) {
            next(err);
        }
    };
}

export default asyncHandler;
