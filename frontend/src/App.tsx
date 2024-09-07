import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, CircularProgress } from '@mui/material';
import { ThumbUp, Repeat } from '@mui/icons-material';
import { backend } from 'declarations/backend';

interface Tweet {
  id: bigint;
  content: string;
  author: string;
  likes: bigint;
  retweets: bigint;
  timestamp: bigint;
}

const App: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [newTweet, setNewTweet] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    setLoading(true);
    try {
      const fetchedTweets = await backend.getTweets();
      setTweets(fetchedTweets);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
    setLoading(false);
  };

  const handleCreateTweet = async () => {
    if (newTweet.trim() === '') return;
    setLoading(true);
    try {
      const result = await backend.createTweet(newTweet, 'Anonymous');
      if ('ok' in result) {
        setTweets([result.ok, ...tweets]);
        setNewTweet('');
      } else {
        console.error('Error creating tweet:', result.err);
      }
    } catch (error) {
      console.error('Error creating tweet:', error);
    }
    setLoading(false);
  };

  const handleLike = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.likeTweet(id);
      fetchTweets();
    } catch (error) {
      console.error('Error liking tweet:', error);
    }
    setLoading(false);
  };

  const handleRetweet = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.retweetTweet(id);
      fetchTweets();
    } catch (error) {
      console.error('Error retweeting:', error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Twitter Clone
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="What's happening?"
        value={newTweet}
        onChange={(e) => setNewTweet(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateTweet}
        disabled={loading}
      >
        Tweet
      </Button>
      {loading && <CircularProgress />}
      <List>
        {tweets.map((tweet) => (
          <ListItem key={tweet.id.toString()}>
            <ListItemText
              primary={tweet.content}
              secondary={`${tweet.author} - ${new Date(Number(tweet.timestamp) / 1000000).toLocaleString()}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleLike(tweet.id)}>
                <ThumbUp />
              </IconButton>
              <Typography variant="caption">{tweet.likes.toString()}</Typography>
              <IconButton edge="end" onClick={() => handleRetweet(tweet.id)}>
                <Repeat />
              </IconButton>
              <Typography variant="caption">{tweet.retweets.toString()}</Typography>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default App;
