import * as authService from '../services/auth';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !phone || !password)
            return res.status(400).json({
                status: 'fail',
                message: 'Missing inputs !',
            });
        const response = await authService.registerService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Fail at auth controller: ' + error,
        });
    }
};
export const login = async (req, res) => {
    const { phone, password } = req.body;
    try {
        if (!phone || !password)
            return res.status(400).json({
                status: 'fail',
                message: 'Missing inputs !',
            });
        const response = await authService.loginService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Fail at auth controller: ' + error,
        });
    }
};
