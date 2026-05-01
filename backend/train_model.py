import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import joblib
import os

data = {
    'text': [
        'Get a free gift card now!', 'Hey, are we still meeting?',
        'URGENT: Account compromised click here http://scam.com', 'Can you send the files?',
        'WINNER! Claim your prize instantly', 'I will be late for lunch',
        'Congrats! Job offer inside, click to accept', 'The weather is nice today',
        'Your bank account is locked. Verify at http://fake-link.com', 'How is your project going?',
        'URGENT ACTION REQUIRED: Click now!', 'See you at the office'
    ],
    'label': [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0] # 1 is Spam, 0 is Ham
}
df = pd.DataFrame(data)
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df['text'])
model = MultinomialNB().fit(X, df['label'])

if not os.path.exists('data'): os.makedirs('data')
joblib.dump(vectorizer, 'data/vectorizer.pkl')
joblib.dump(model, 'data/model.pkl')
print("DONE! Brain created.")