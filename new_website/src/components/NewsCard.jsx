const NewsCard = ({ title, summary, source }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition bg-white">
      <h3 className="font-heading text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted mb-3">{summary}</p>
      <span className="text-xs text-gray-500">{source}</span>
    </div>
  );
};

export default NewsCard;
