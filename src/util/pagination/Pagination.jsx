const Pagination = ({ page, totalPages, onPageChange }) => {
    const handlePrevPage = () => {
        if (page > 1) onPageChange(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) onPageChange(page + 1);
    };

    // This function can be used to refresh the game room list if needed
    // For now, it is not implemented
    return (
        <div className="pagination">
            <button onClick={handlePrevPage} disabled={page === 1}>이전</button>
            <span>{page} / {totalPages}</span>
            <button onClick={handleNextPage} disabled={page === totalPages}>다음</button>
        </div>
    );
};

export default Pagination;

