const Search = ({ searchHandler }) => {
    return (
        <>
            <div>Find countries <input onChange={searchHandler} /><button>Clear</button></div>
        </>
    );
};

export default Search;