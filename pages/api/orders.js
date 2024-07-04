import {mongooseConnect} from "@/lib/mongoose";
import {Order} from "@/models/Order";

export default async function handler(req,res) {
  await mongooseConnect();
  const {method} = req;

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Order.findById({_id: req.query?.id}));
    } else {
      res.json(await Order.find().sort({createdAt:-1}));
    }   
  }

  if (method === 'DELETE') {
    const {_id} = req.query;
    await Order.deleteOne({_id});
    res.json('ok');
}
 
}