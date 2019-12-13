import repository from '../../../domain/quotes/repository';

export default async (req, res) => {
  const quotes = await repository.findAll();

  res.status(200).json({
    data: quotes
  });
};
