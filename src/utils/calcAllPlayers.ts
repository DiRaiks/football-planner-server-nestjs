export const calcAllPlayers = (players): { all: number, maybe: number, exactly: number } => {
  let count = 0;
  let maybe = 0;
  let exactly = 0;

  players.forEach((item) => {
    item.status ? exactly++ : maybe++;
    item.friends.forEach(friend => friend.status ? exactly++ : maybe++);
    count += item.friends.length;
  });

  return { all: count + players.length, maybe, exactly };
};
