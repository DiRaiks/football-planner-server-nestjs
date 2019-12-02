export const calcAllPlayers = (players): number => {
  let count = 0;

  players.forEach((item) => {
    count += item.friends.length;
  });

  return count + players.length;
}
