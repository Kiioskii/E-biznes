import org.scalatra.LifeCycle
import javax.servlet.ServletContext
import com.example.app.ProductController
import com.example.app.CategoryController
import com.example.app.CartController

class ScalatraBootstrap extends LifeCycle {
  override def init(context: ServletContext): Unit = {
        context.mount(new ProductController, "/api")
    context.mount(new CategoryController, "/api")
    context.mount(new CartController, "/api")
  }
}
