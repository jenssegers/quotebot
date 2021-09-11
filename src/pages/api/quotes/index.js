import QuotesRepository from '../../../domain/quotes/QuotesRepository';
import morgan from 'micro-morgan';

export default morgan('common')(async (req, res) => {
	const quotes = await QuotesRepository.findAll();

	res.status(200).json({
		data: quotes,
	});
});
