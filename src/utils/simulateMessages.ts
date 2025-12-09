const createMessage = (id) => ({
  id: `msg-${id}`,
  sender: id % 2 === 0 ? "self" : "other",
  text: `Message ${id}: This is a simulated chat message.`,
  timestamp: Date.now() - id * 1000,
});

export const simulateMessages = ({
  page,
  pageSize = 20,
}: {
  page: number;
  pageSize: number;
}): Promise<any> => {


  const newestIdInBatch = page * pageSize;
  const oldestIdInBatch = (page + 1) * pageSize - 1;

  // const startId = page * pageSize;

  // const endId = startId + pageSize;

  const messages: Array<{
    id: string;
    text: string;
    timestamp: number;
  }> = [];

  for (let i = oldestIdInBatch; i >= newestIdInBatch; i--) {
    if (i > 300) continue;
    messages.push(createMessage(i));
  }


  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        messages: messages,
        hasMore: (page + 1) * pageSize < 300,
      });
    }, 800);
  });
};
