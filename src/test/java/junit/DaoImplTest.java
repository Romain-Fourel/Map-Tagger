package junit;
import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

import org.junit.Test;

import com.glproject.map_tagger.dao.DAO;
import com.glproject.map_tagger.dao.Map;
import com.glproject.map_tagger.dao.User;
import com.glproject.map_tagger.dao.UserDao;
import com.glproject.map_tagger.dao.impl.UserDaoImpl;

public class DaoImplTest {

	@Test
	public void test() {
		PersistenceManagerFactory pmf = JDOHelper.getPersistenceManagerFactory("Persistence");
		UserDao userDao = new UserDaoImpl(pmf);

		assertEquals(null, userDao.getUser("Alfred"));

		User user = new User();
		user.setLocation("Paris");
		user.setName("Alfred");
		user.setMapList(new ArrayList<Map>());

		userDao.addUser(user);

		assertEquals(user, userDao.getUser("Alfred"));

		DAO.getUserDao().getUser("Alfred");
	}

}












