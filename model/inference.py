import joblib

# Load the TfidfVectorizer
vectorizer = joblib.load('models/tfidf_vectorizer.pkl')

# Load the SVC model
svm_model = joblib.load('models/svm_model.pkl')

def predict(text):
    new_data_tfidf = vectorizer.transform(text).toarray()
    predictions = svm_model.predict(new_data_tfidf)

    if predictions == 1:
        return 'Spam'
    else:
        return 'Ham'
    
if __name__ == "__main__":
    import pandas as pd

    text = pd.read_csv('data/inference/test.csv').sample()

    print('Message: ', text.Message.values[0])
    print('Original: ', text.Category.values[0])
    print("Predicted: ", predict(text.Message.tolist()))
