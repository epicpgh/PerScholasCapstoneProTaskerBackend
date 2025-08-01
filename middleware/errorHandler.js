

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
}

export const notFoundHandler = (req, res, next) => {
    res.status(404).json({ message: 'Resource not found' });
}