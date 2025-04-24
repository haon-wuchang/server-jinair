
import * as service from '../service/paymentsService.js';
/******************
 * order
 */
export async function confirmPayment(req, res, next) {
    const confirmResponse = await service.confirmPayment(req.query);
    return res.json({ data: confirmResponse });
}

 
