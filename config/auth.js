import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // ShopGlobal లో వాడే secret key

const  auth = (req, res, next) => {
  // Authorization header చూస్తాం
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>" నుండి token తీసుకోవడం

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // మీరు decoded నుండి companyId, email, ఇతర వివరాలు తీసుకోవచ్చు
    req.companyId = decoded.companyId;
    req.email = decoded.email;

    next(); // అప్పుడు రిక్వెస్ట్ తర్వాతి middleware/route కి పోతుంది
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

export default auth