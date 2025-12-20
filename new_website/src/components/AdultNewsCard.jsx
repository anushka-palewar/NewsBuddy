const AdultNewsCard = ({ news }) => {
  return (
    <div className="adult-card">
      <h3>{news.title}</h3>

      <p className="adult-summary">{news.summary}</p>

      <div className="adult-footer">
        <span className="category">{news.category}</span>
        <a href={news.sourceUrl} target="_blank" rel="noreferrer">
          Read full article →
        </a>
      </div>
    </div>
  );
};

export default AdultNewsCard;
