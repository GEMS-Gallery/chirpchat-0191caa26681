import Text "mo:base/Text";

import Array "mo:base/Array";
import Result "mo:base/Result";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Nat "mo:base/Nat";

actor {
  type Tweet = {
    id: Nat;
    content: Text;
    author: Text;
    likes: Nat;
    retweets: Nat;
    timestamp: Int;
  };

  stable var tweets : [Tweet] = [];
  stable var nextTweetId : Nat = 0;

  public func createTweet(content: Text, author: Text) : async Result.Result<Tweet, Text> {
    let tweet : Tweet = {
      id = nextTweetId;
      content = content;
      author = author;
      likes = 0;
      retweets = 0;
      timestamp = Time.now();
    };
    tweets := Array.append(tweets, [tweet]);
    nextTweetId += 1;
    #ok(tweet)
  };

  public query func getTweets() : async [Tweet] {
    tweets
  };

  public func likeTweet(id: Nat) : async Result.Result<(), Text> {
    let index = Array.indexOf<Tweet>({ id = id; content = ""; author = ""; likes = 0; retweets = 0; timestamp = 0 }, tweets, func(a, b) { a.id == b.id });
    switch (index) {
      case null { #err("Tweet not found") };
      case (?i) {
        let updatedTweet = {
          id = tweets[i].id;
          content = tweets[i].content;
          author = tweets[i].author;
          likes = tweets[i].likes + 1;
          retweets = tweets[i].retweets;
          timestamp = tweets[i].timestamp;
        };
        tweets := Array.mapEntries<Tweet, Tweet>(tweets, func(t, j) {
          if (j == i) { updatedTweet } else { t }
        });
        #ok(())
      };
    }
  };

  public func retweetTweet(id: Nat) : async Result.Result<(), Text> {
    let index = Array.indexOf<Tweet>({ id = id; content = ""; author = ""; likes = 0; retweets = 0; timestamp = 0 }, tweets, func(a, b) { a.id == b.id });
    switch (index) {
      case null { #err("Tweet not found") };
      case (?i) {
        let updatedTweet = {
          id = tweets[i].id;
          content = tweets[i].content;
          author = tweets[i].author;
          likes = tweets[i].likes;
          retweets = tweets[i].retweets + 1;
          timestamp = tweets[i].timestamp;
        };
        tweets := Array.mapEntries<Tweet, Tweet>(tweets, func(t, j) {
          if (j == i) { updatedTweet } else { t }
        });
        #ok(())
      };
    }
  };
}
