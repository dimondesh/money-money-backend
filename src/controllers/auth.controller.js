import {
  loginUser,
  registerUser,
  logoutUser,
  refreshSession,
} from '../services/auth.service.js';

export async function registerController(req, res) {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'User created successfully',
    data: user,
  });
}



export async function logoutController(req, res) {
  const { sessionId, refreshToken } = req.cookies;
  if (typeof sessionId === 'string' && typeof refreshToken === 'string') {
    await logoutUser(sessionId, refreshToken);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).end();
}


export async function loginController(req, res) {
  const session = await loginUser(req.body.email, req.body.password);

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    expires: session.refreshTokenValidUntil, // <-- исправлено
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil, // <-- исправлено
  });

  res.status(200).json({
    status: 200,
    message: 'User logged in successfully',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function refreshController(req, res) {
  const { sessionId, refreshToken } = req.cookies;
  const session = await refreshSession(sessionId, refreshToken);


  res.cookie("sessionId", session._id.toString(), {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: "Session refreshed successfully",
    data: {
      accessToken: session.accessToken,
    },
  });
}


