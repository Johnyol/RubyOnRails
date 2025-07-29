require "test_helper"

class MultasControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get multas_index_url
    assert_response :success
  end

  test "should get create" do
    get multas_create_url
    assert_response :success
  end

  test "should get destroy" do
    get multas_destroy_url
    assert_response :success
  end
end
