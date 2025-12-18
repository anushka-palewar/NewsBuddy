const KidsNewsCard = ({ news }) => {
  return (
    <div className="kids-card">
      <h3>{news.title}</h3>
      <p>{news.summary}</p>
      <a href={news.sourceUrl} target="_blank" rel="noreferrer">
        Read More →
      </a>
    </div>
  );
};

export default KidsNewsCard;
