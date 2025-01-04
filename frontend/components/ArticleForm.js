import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' };

export default function ArticleForm(props) {
  const { postArticle, updateArticle, setCurrentArticleId, currentArticle } = props;

  const [values, setValues] = useState(initialFormValues);

  useEffect(() => {
    if (currentArticle) {
      setValues(currentArticle); 
    } else {
      setValues(initialFormValues); 
    }
  }, [currentArticle]);
  
  

  const onChange = (evt) => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    if (currentArticle) {
      updateArticle({ article_id: currentArticle.article_id, article: values });
    } else {
      postArticle(values);
    }
    setValues(initialFormValues); // Reset form after submission
    setCurrentArticleId(null); // Exit editing mode
  };
  
  const isDisabled = () => {
    return !values.title.trim() || !values.text.trim() || !values.topic;
  };

  return (
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? 'Edit Article' : 'Create Article'}</h2>
      <input
        id="title"
        maxLength={50}
        value={values.title}
        onChange={onChange}
        placeholder="Enter title"
      />
<textarea
  id="text"
  maxLength={200}
  value={values.text} 
  onChange={onChange}
  placeholder="Enter text"
/>


      <select id="topic" value={values.topic} onChange={onChange}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button
          id="submitArticle" // Ensure the ID is correct
          disabled={isDisabled()} // Ensure button starts disabled
        >
          Submit
        </button>
        {currentArticle && (
          <button type="button" onClick={() => setCurrentArticleId(null)}>
            Cancel edit
          </button>
        )}
      </div>
    </form>
  );
}


// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
