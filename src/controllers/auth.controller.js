import * as authService from '../services/auth.service.js';

export const login = async (req, res) => {
  try {
    const sessionData = await authService.loginUser(req.body);

    res.cookie('refreshToken', sessionData.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: sessionData.user,
      accessToken: sessionData.accessToken,
      accessTokenExpires: sessionData.accessTokenExpires,
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
