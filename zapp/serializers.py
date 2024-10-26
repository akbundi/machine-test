from rest_framework import serializers
from .models import Book, Review

# Serializer for Book model
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'isbn', 'published_date', 'genre']

# Serializer for Review model
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'book', 'reviewer_name', 'rating', 'review_text', 'review_date']
        
    # Nested representation for the book in the review if required
    book = BookSerializer(read_only=True)