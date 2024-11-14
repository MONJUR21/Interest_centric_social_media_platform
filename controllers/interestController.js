import db from '../config/db.js';

export const getAllInterests = (req, res) => {
  const query = 'SELECT * FROM interests';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching interests:', err);
      res.status(500).json({ error: 'Failed to fetch interests' });
    } else {
      res.status(200).json(results);
    }
  });
};

export const getInterestById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM interests WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching interest by ID:', err);
      res.status(500).json({ error: 'Failed to fetch interest' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Interest not found' });
    } else {
      res.status(200).json(results[0]);
    }
  });
};

export const createInterest = (req, res) => {
  const { name } = req.body;
  const query = 'INSERT INTO interests (name) VALUES (?)';

  db.query(query, [name], (err, results) => {
    if (err) {
      console.error('Error creating interest:', err);
      res.status(500).json({ error: 'Failed to create interest' });
    } else {
      res.status(201).json({ message: 'Interest created successfully', interestId: results.insertId });
    }
  });
};

export const updateInterest = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const query = 'UPDATE interests SET name = ? WHERE id = ?';

  db.query(query, [name, id], (err, results) => {
    if (err) {
      console.error('Error updating interest:', err);
      res.status(500).json({ error: 'Failed to update interest' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Interest not found' });
    } else {
      res.status(200).json({ message: 'Interest updated successfully' });
    }
  });
};

export const deleteInterest = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM interests WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting interest:', err);
      res.status(500).json({ error: 'Failed to delete interest' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Interest not found' });
    } else {
      res.status(200).json({ message: 'Interest deleted successfully' });
    }
  });
};
