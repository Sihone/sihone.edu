const db = require('../db');

function laptopsGetRouter(req, res) {
  console.log('laptopsGetRouter');
  const { company_id } = req.params;
  db.query('SELECT * FROM laptops WHERE company_id = ?', [company_id], async (result, error) => {
    if (error) {
      console.log(error);
      res.status(500).json(error);
    } else {
      res.json(result.rows);
    }
  });
}

function laptopGetRouter(req, res) {
  console.log('laptopGetRouter');
  const { company_id, id } = req.params;
  db.query('SELECT * FROM laptops WHERE company_id = ? AND id = ?', [company_id, id], async (result, error) => {
    if (error) {
      console.log(error);
      res.status(500).json(error);
    } else {
      const laptop = result.rows[0];
      res.json(laptop);
    }
  });
}

function laptopsPostRouter(req, res) {
  console.log('laptopsPostRouter');
  const { company_id, make_model, serial_number } = req.body;
  db.query(
    'INSERT INTO laptops (company_id, make_model, serial_number) VALUES (?, ?, ?)',
    [company_id, make_model, serial_number],
    async (result, error) => {
      if (error) {
        console.log(error);
        res.status(500).json(error);
      } else {
        res.status(201).json();
      }
    } 
  );
}

function laptopsDeleteRouter(req, res) {
  console.log('laptopsDeleteRouter');
  const { id } = req.params;
  db.query('DELETE FROM laptops WHERE id = ?', [id], async (result, error) => {
    if (error) {
      console.log(error);
      res.status(500).json(error);
    } else {
      res.status(201).json({id});
    }
  });
}

function laptopsPutRouter(req, res) {
  console.log('laptopsPutRouter');
  const { id, make_model, serial_number, status, student_id } = req.body;
  db.query(
    'UPDATE laptops SET make_model = ?, serial_number = ?, status = ?, student_id = ? WHERE id = ?',
    [make_model, serial_number, status, student_id, id],
    async (result, error) => {
      if (error) {
        console.log(error);
        res.status(500).json(error);
      } else {
        res.status(201).json();
      }
    }
  );
}

module.exports = {
  laptopsGetRouter,
  laptopGetRouter,
  laptopsPostRouter,
  laptopsDeleteRouter,
  laptopsPutRouter
};
