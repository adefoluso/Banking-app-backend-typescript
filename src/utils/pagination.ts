const pagination = (page: string, count: number) => {
  const end = parseInt(page) * 5;
	let previous = null;
	let next = null;
	let skip = 0;
  
  if(end < count) {
    next = parseInt(page) + 1;
  }

  if(parseInt(page) > 1) {
    previous = parseInt(page) - 1;
    skip = previous * 5;
  }

	return { previous, next, skip };
};

export default pagination;